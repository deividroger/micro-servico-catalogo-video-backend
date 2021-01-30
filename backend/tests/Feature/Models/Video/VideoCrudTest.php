<?php
namespace Tests\Feature\Models\Video;

use App\Models\Category;
use App\Models\Genre;
USE App\Models\Video;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\DatabaseMigrations;

class VideoCrudTest extends BaseVideoTestCase {

    use DatabaseMigrations;

    private $fileFields = [];

    protected function setUp(): void
    {
        parent::setUp();

        foreach(Video::$fileFields as $field){
            $fileFields[$field] = "$field.test";
        }
    }

    public function testList(){
        factory(Video::class)->create();
        $videos = Video::all();
        $this->assertCount(1,$videos);
        $videoKeys = array_keys($videos->first()->getAttributes());
     
        $this->assertEqualsCanonicalizing([
            'id',
            'title',
            'description',
            'year_launched',
            'opened',
            'rating',
            'duration',
            'created_at',
            'updated_at',
            'deleted_at',
            'video_file',
            'thumb_file',
            'banner_file',
            'trailer_file'
        ],$videoKeys);

    }

    public function testCreateWithBasicFields(){



        $video = Video::create($this->data + $this->fileFields);
        $video->refresh();
        
        $this->assertEquals(36, strlen($video->id));
        $this->assertFalse($video->opened);
        $this->assertDatabaseHas('videos',$this->data + $this->fileFields + ['opened' => false]);

        $video= Video::create($this->data + ['opened' => true]);
        $this->assertTrue($video->opened);
        $this->assertDatabaseHas('videos',$this->data + ['opened' => true]);
        
    }

    public function testcreateWithRelations(){
        $category = factory(Category::class)->create();
        $genre = factory(Genre::class)->create();
        $video = Video::create($this->data + [
            'categories_id' => [$category->id],
            'genres_id' => [$genre->id]
        ]);

        $this->assertHasCategory($video->id,$category->id);

        $this->assertHasGenre($video->id,$genre->id);
    }

    public function testRollbackCreate()
    {

        $hasError = false;

        try {
            Video::create([
                'title' => 'title',
                'description' => 'description',
                'year_launched' => 2020,
                'rating' => Video::RATING_LIST[0],
                'duration' => 120,
                'categories_id' =>[0,1,2]
            ]);
        } catch (QueryException $th) {
            $this->assertCount(0, Video::all());
            $hasError = true;

        }
        $this->assertTrue($hasError);

    }

    public function testUpdateWithBasicFields(){


        $video = factory(Video::class)->create(['opened' => false]);
        $video->update($this->data + $this->fileFields);
        $this->assertFalse($video->opened);
        $this->assertDatabaseHas('videos',$this->data + $this->fileFields + ['opened'=>false]);

        $video = factory(Video::class)->create(
            ['opened' =>false]
        );
        
        $video->update($this->data + ['opened'=> true]);
        $this->assertTrue($video->opened);
        $this->assertDatabaseHas('videos',['opened'=>true]);
    
    }

    public function testUpdateWithRelations(){
        $category = factory(Category::class)->create();
        $genre  = factory(Genre::class)->create();
        $video = factory(Video::class)->create();
        $video->update($this->data + [
            'categories_id' => [$category->id],
            'genres_id' => [$genre->id]
        ] );

        $this->assertHasCategory($video->id,$category->id);
        $this->assertHasGenre($video->id,$genre->id);

    }


    

    public function testRollbackUpdate(){

        $video = factory(Video::class)->create();
        $oldTitle = $video->title;
        $hasError = false;

        try {
            $video->update([
                'title' => 'title',
                'description' => 'description',
                'year_launched' => 2020,
                'rating' => Video::RATING_LIST[0],
                'duration' => 120,
                'categories_id' =>[0,1,2]
            ]);
        } catch (QueryException $th) {
            $this->assertDatabaseHas('videos',[
                'title' => $oldTitle
            ]);
            
            $hasError = true;

        }
        $this->assertTrue($hasError);
    }

    public function testHandleRelations(){
        $video = factory(Video::class)->create();
        
        Video::handleRelations($video,[]);

        $this->assertCount(0,$video->categories);
        $this->assertCount(0,$video->genres);

        $category = factory(Category::class)->create();
        Video::handleRelations($video,[
            'categories_id' => [$category->id],
        ]);

        $video->refresh();

        $this->assertCount(1,$video->categories);


        $genre = factory(Genre::class)->create();
        Video::handleRelations($video,[
            'genres_id' => [$genre->id]
        ]);

        $video->refresh();

        $this->assertCount(1,$video->genres);

            
        $video->categories()->delete();
        $video->genres()->delete();

        Video::handleRelations($video,[
            'genres_id' => [$genre->id],
            'categories_id' => [$category->id],
        ]);

        $video->refresh();

        $this->assertCount(1,$video->genres);
        $this->assertCount(1,$video->categories);

    }

    public function testSyncCategories()
    {
        $categoryId = factory(Category::class,3)->create()->pluck('id')->toArray();
        $video = factory(Video::class)->create();

        Video::handleRelations($video,[
            'categories_id' => [$categoryId[0]]
        ]);

        $this->assertDatabaseHas('category_video',[
            'category_id' => $categoryId[0],
            'video_id' => $video->id
        ]);

        Video::handleRelations($video,[
            'categories_id' => [$categoryId[1],$categoryId[2]]
        ]);

        $this->assertDatabaseMissing('category_video',[
            'category_id' => $categoryId[0],
            'video_id' => $video->id
        ]);

        $this->assertDatabaseHas('category_video',[
            'category_id' => $categoryId[1],
            'video_id' => $video->id
        ]);

        $this->assertDatabaseHas('category_video',[
            'category_id' => $categoryId[2],
            'video_id' => $video->id
        ]);

    }

    public function testSyncGenres()
    {
        $genresId = factory(Genre::class,3)->create()->pluck('id')->toArray();
        $video = factory(Video::class)->create();

        Video::handleRelations($video,[
            'genres_id' => [$genresId[0]]
        ]);

        $this->assertDatabaseHas('genre_video',[
            'genre_id' => $genresId[0],
            'video_id' => $video->id
        ]);

        Video::handleRelations($video,[
            'genres_id' => [$genresId[1],$genresId[2]]
        ]);

        $this->assertDatabaseMissing('genre_video',[
            'genre_id' => $genresId[0],
            'video_id' => $video->id
        ]);

        $this->assertDatabaseHas('genre_video',[
            'genre_id' => $genresId[1],
            'video_id' => $video->id
        ]);

        $this->assertDatabaseHas('genre_video',[
            'genre_id' => $genresId[2],
            'video_id' => $video->id
        ]);

    }

    public function testDelete(){
        $video = factory(Video::class)->create();
        $video->delete();
        $this->assertNull(Video::find($video->id));

        $video->restore();
        $this->assertNotNull(Video::find($video->id));
    }


    protected function assertHasCategory($videoId, $categoryId)
    {
        $this->assertDatabaseHas('category_video', [
            'category_id' => $categoryId,
            'video_id' => $videoId
        ]);
    }

    protected function assertHasGenre($videoId, $genreId)
    {
        $this->assertDatabaseHas('genre_video', [
            'genre_id' => $genreId,
            'video_id' => $videoId
        ]);
    }


}