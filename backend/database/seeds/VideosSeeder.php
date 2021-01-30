<?php

use App\Models\Genre;
use App\Models\Video;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Seeder;
use Illuminate\Http\UploadedFile;

class VideosSeeder extends Seeder
{
    private $allGenres;
    private $relations = [
        'genres_id' => [],
        'categories_id' => []
    ];

    // public function run()
    // {
    //     $genres = Genre::all();
    //     factory(Video::class,100)->create()
    //         ->each(function(Video $video) use ($genres){
    //             $subGenres = $genres->random(5)->load('categories');
    //             $categoriesId = [];

    //             foreach($subGenres as $genre ){
    //                 array_push($categoriesId,...$genre->categories->pluck('id')->toArray());
    //             }
    //             $categoriesId = array_unique($categoriesId);
    //             $video->categories()->attach($categoriesId);
    //             $video->genres()->attach($subGenres->pluck('id')->toArray() );
    //         } );
    // }

    public function run()
    {
        $dir = \Storage::getDriver()->getAdapter()->getPathPrefix();
        \File::deleteDirectory($dir, true);
        $self = $this;
        $this->allGenres = Genre::all();

        Model::reguard();
        

        factory(\App\Models\Video::class, 5)
            ->make()
            ->each(function (Video $video) use ($self) {
                $self->fetchRelations();
                \App\Models\Video::create(
                    array_merge($video->toArray(), [
                        'thumb_file' => $self->getImageFile(),
                        'banner_file' => $self->getImageFile(),
                        'trailer_file' => $self->getVideoFile(),
                        'video_file' => $self->getVideoFile(),
                    ], $this->relations)
                );
            });

        Model::unguard();
    }

    public function fetchRelations()
    {
        $subGenres = $this->allGenres->random(5)->load('categories');
        $categoriesId = [];

        foreach ($subGenres as $genre) {
            array_push($categoriesId, ...$genre->categories->pluck('id')->toArray());
        }
        $categoriesId = array_unique($categoriesId);
        $genreId = $subGenres->pluck('id')->toArray();
        $this->relations['categories_id'] = $categoriesId;
        $this->relations['genres_id'] = $genreId;
    }
    public function getImageFile(){
        return new UploadedFile(
            storage_path('faker/thumbs/Laravel Framework.png'),
            'Laravel Framework.png'
        );
    }

    public function getVideoFile(){
        return new UploadedFile(
            storage_path('faker/videos/demo-video.mp4'),
            'demo.mp4'
        );
    }
}
