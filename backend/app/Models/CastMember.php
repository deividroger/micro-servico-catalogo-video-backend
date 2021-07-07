<?php

namespace App\Models;


use App\Models\Traits\Uuid;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

use App\ModelFilters\CastMemberFilter;

use EloquentFilter\Filterable;


class CastMember extends Model
{
    use Uuid,SoftDeletes,Filterable;
    
    const TYPE_DIRECTOR = 1;
    const TYPE_ACTOR = 2;
    
    public static $types = [
        CastMember::TYPE_DIRECTOR,
        CastMember::TYPE_ACTOR,
    ];

    protected $fillable = ['name','type'];
    protected $dates = ['deleted_at'];
  
    public $incrementing = false;

    protected $casts = [
        'id' => 'string',
        'type' => 'integer'
    ];

    public function modelFilter()
    {
        return $this->provideFilter(CastMemberFilter::class);
    }
}
