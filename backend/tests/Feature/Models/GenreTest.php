<?php

namespace Tests\Feature\Models;

use App\Models\Genre;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Ramsey\Uuid\Uuid;
use Tests\TestCase;

class GenreTest extends TestCase
{
    use DatabaseMigrations;
    public function testList()
    {

        factory(Genre::class, 1)->create();

        $genre = Genre::all();

        $this->assertCount(1, $genre);

        $categoryKeys = array_keys($genre->first()->getAttributes());

        $this->assertEqualsCanonicalizing(
            [
                'id', 'name', 'description', 'is_active', 'created_at', 'updated_at', 'deleted_at'
            ],
            $categoryKeys
        );
    }

    public function testRemove()
    {

        $genre = Genre::create(['name' => 'item_to_be_removed']);

        $this->assertCount(1, Genre::all());

        $genre->delete();

        $this->assertCount(0, Genre::all());
    }

    public function testCreate()
    {
        $data = [
            'name' => 'genre_created', 'is_active' => true
        ];

        $genre = Genre::create($data);

        $this->assertCount(1, Genre::all());

        $this->assertEquals('genre_created', $genre->name);

        $this->assertTrue($genre->is_active);
    }

    public function testUpdate()
    {

        $genre =   factory(Genre::class)->create([
            'name' => 'genre_name',
            'is_active' => false
        ]);
        
        $this->assertEquals('genre_name',$genre->name);
        $this->assertFalse($genre->is_active);

        $data =  [
            'name' => 'genre_name_updated',
            'is_active' => true
        ];

        $genre->update($data);

        foreach($data as $key =>$value){
            $this->assertEquals($value,$genre->{$key});
        }
    }


    public function test_UUID(){
        factory(Genre::class, 1)->create();

        $genre = Genre::first();

        $this->assertNotNull($genre->id);

        $this->assertEquals(36,strlen($genre->id));

        $this->assertTrue(Uuid::isValid($genre->id));
    }
}
