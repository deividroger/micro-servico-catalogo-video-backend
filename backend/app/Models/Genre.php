<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

use App\ModelFilters\GenreFilter;

use EloquentFilter\Filterable;
use App\Models\Traits\SerializeDateToIso8601;

class Genre extends Model
{
    use SoftDeletes, \App\Models\Traits\Uuid, Filterable,SerializeDateToIso8601;
    protected $fillable = ['name','is_active'];
    protected $dates =['deleted_at'];
    protected $casts = [
      
        'id'=> 'string',
        'is_active'=> 'boolean'
    ];

    public $incrementing = false;
    protected $keyType = 'string';

    protected $observables = [
        'belongsToManyAttached'
    ];

    public function categories()
    {
        return $this->belongsToMany(Category::class)->withTrashed();
    }

    public function modelFilter()
    {
        return $this->provideFilter(GenreFilter::class);
    }
}
