<?php

namespace Tests\Feature\Http\Controllers\Api;

use Tests\TestCase;
use App\Models\Genre;
use Illuminate\Support\Facades\Lang;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\TestResponse;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\Traits\TestValidations;

class GenreControllerTest extends TestCase
{
    use DatabaseMigrations,TestValidations;
    
    public function testIndex()
    {
        $genre = factory(Genre::class)->create();
        $response = $this->get(route("genres.index"));

        $response
            ->assertStatus(200)
            ->assertJson([$genre->toArray()]);
    }

    public function testShow()
    {
        $genre = factory(Genre::class)->create();
        $response = $this->get(route("genres.show", ["genre" => $genre->id]));

        $response
            ->assertStatus(200)
            ->assertJson($genre->toArray());
    }

    public function testInvalidationData()
    {
        $data =[
            'name' => ''
        ];

        $this->assertInvalidationInStoreAction($data,'required');


        $data = [
            'name' => str_repeat('a', 256)
            
        ];

        $this->assertInvalidationInStoreAction($data,'max.string',['max'=>255]);

        $data = [
            'is_active' => 'a'
            
        ];

        $this->assertInvalidationInStoreAction($data,'boolean');

        $genre = factory(Genre::class)->create();
        $response = $this->json("PUT", route("genres.update", ["genre" => $genre->id]), []);
        $this->assertInvalidationRequired($response);

        $response = $this->json("PUT", route("genres.update", ["genre" => $genre->id]), [
            "name" => str_repeat("a", 256),
            "is_active" => "a"
        ]);
        $this->assertInvalidationMax($response);       
        $this->assertInvalidationBoolean($response);
    }

    protected function assertInvalidationRequired(TestResponse $response)
    {
        $this->assertInvalidationFields($response,['name'],'required',[]);

        $response->assertJsonMissingValidationErrors(["is_active"]);    
    }

    protected function assertInvalidationMax(TestResponse $response)
    {
        $this->assertInvalidationFields($response,['name'],'max.string',['max'=> 255]);

    }

    protected function assertInvalidationBoolean(TestResponse $response)
    {
        $this->assertInvalidationFields($response,['is_active'],'boolean',[]);
    }    

    public function testStore()
    {
        $response = $this->json("POST", route("genres.store"), [
           "name" => "test" 
        ]);

        $id = $response->json("id");
        $genre = Genre::find($id);

        $response
            ->assertStatus(201)
            ->assertJson($genre->toArray());
        $this->assertTrue($response->json("is_active"));

        $response = $this->json("POST", route("genres.store"), [
            "name" => "test",
            "is_active" => false
         ]);
 
        $response
            ->assertJsonFragment([
                "is_active" => false
            ]);
    }

    public function testUpdate()
    {
        $genre = factory(Genre::class)->create([
            "is_active" => false
        ]);
        $response = $this->json("PUT", route("genres.update", ["genre" => $genre->id]), [
           "name" => "test",
           "is_active" => true
        ]);

        $id = $response->json("id");
        $genre = Genre::find($id);

        $response
            ->assertStatus(200)
            ->assertJson($genre->toArray())
            ->assertJsonFragment([
                "is_active" => true
            ]);
    }

    public function testDelete()
    {
        $genre = factory(Genre::class)->create();
        $response = $this->json("DELETE", route("genres.destroy", ["genre" => $genre->id]));                
        $response->assertStatus(204);
        $this->assertNull(Genre::find($genre->id));
        $this->assertNotNull(Genre::withTrashed()->find($genre->id));
    }

    protected function routeStore(){
        return route('genres.store');
    }
}