<?php

namespace Tests\Unit\Models;

use App\Models\Category;
use App\Models\Traits\Uuid;
use Illuminate\Database\Eloquent\SoftDeletes;
use PHPUnit\Framework\TestCase;
use EloquentFilter\Filterable;
class CategoryUnitTest extends TestCase
{
     private $category;

    public static function setUpBeforeClass(): void
    {
        parent::setUpBeforeClass();
    }

    public static function tearDownAfterClass(): void
    {
        parent::tearDownAfterClass();
    }

     protected function setUp(): void
     {
         parent::setUp();

         $this->category = new Category();
     }

     protected function tearDown(): void
     {
         parent::tearDown();
     }

    public function testFillableAttribute()
    {
        $fillable = ['name','description','is_active'];
         $this->assertEquals($fillable,$this->category->getFillable()); 
    }

    public function testDatesAttributes(){
        $dates = ['deleted_at','created_at','updated_at'];

        foreach($dates as $date){
            $this->assertContains($date,$this->category->getDates());
        }

       $this->assertCount(count($dates), $this->category->getDates());
    }

    public function testIfUseTraits(){

        $traits =[
            SoftDeletes::class, Uuid::class,Filterable::class
        ];
       
        $categoryTraits = array_keys( class_uses(Category::class));
        $this->assertEquals($traits,$categoryTraits);
    }

    public function testCastsAttributes()
    {
        $casts = ['id' =>'string','is_active'=>'boolean'];
         $this->assertEquals($casts,$this->category->getCasts());
    }

    public function testIncrementing()
    {
         $this->assertFalse($this->category->incrementing);
    }
}
