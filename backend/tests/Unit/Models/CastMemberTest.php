<?php

namespace Tests\Feature\Models;

use Tests\TestCase;
use App\Models\CastMember;

use Illuminate\Foundation\Testing\DatabaseMigrations;

class CastMemberTest extends TestCase
{
    use DatabaseMigrations;

    public function testList()
    {
        factory(CastMember::class, 1)->create();
        $castMembers = CastMember::all();
        $this->assertCount(1, $castMembers);
        $castMemberKey = array_keys($castMembers->first()->getAttributes());
        $this->assertEqualsCanonicalizing(
            ['id', 'name', 'type', 'created_at', 'updated_at', 'deleted_at'],
            $castMemberKey
        );
    }

    public function testCreate()
    {
        $castMember = CastMember::create([
            'name' => 'test1',
            'type' => 1
        ]);
        $castMember->refresh();
        $this->assertEquals(36, strlen($castMember->id));
        $this->assertEquals('test1',$castMember->name);
        $this->assertEquals(1,$castMember->type);
    }

    public function testUpdate()
    {
        $castMember = factory(CastMember::class)->create([
            'type' => 1
        ]);
        
        $data = ['name' => 'test_name_updated',
                 'type' => 2];
        $castMember->update($data);

        foreach ($data as $key => $value){
            $this->assertEquals($value, $castMember->{$key});
        }

    }

    public function testDelete()
    {
        $castMember = factory(CastMember::class)->create();
        $castMember->delete();
        $castMembers = CastMember::all();
        $this->assertCount(0, $castMembers);
    }
}