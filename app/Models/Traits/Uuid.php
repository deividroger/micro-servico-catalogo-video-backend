<?php
namespace App\Models\Traits;

Use Ramsey\Uuid\Uuid as RamseyUuid;

trait Uuid{
 
    public static function boot(){
        
        parent::boot();

        static::creating(function($obj){
            $obj->id = RamseyUuid::uuid4()->toString();
        });

    }
}
