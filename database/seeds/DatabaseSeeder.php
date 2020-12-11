<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    
    public function run()
    {
        $this->call(VideosSeeder::class);
         $this->call(CategoriesTableSeeder::class);
         $this->call(GenresTableSeeder::class);
         $this->call(CastMembersTableSeeder::class);
         
    }
}
