<?php

namespace App\Models;

use App\ModelFilters\CategoryFilter;
use EloquentFilter\Filterable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Traits\SerializeDateToIso8601;


class Category extends Model
{
    use SoftDeletes, \App\Models\Traits\Uuid, Filterable, SerializeDateToIso8601;
    protected $fillable = ['name','description','is_active'];
    protected $dates =['deleted_at'];
    protected $casts = [
      
        'id'=> 'string',
        'is_active' => 'boolean'
    ];
 
    public $incrementing = false;
    protected $keyType = 'string';

    public function modelFilter()
    {
        return $this->provideFilter(CategoryFilter::class);
    }

    public function genres() {
     return  $this->belongsToMany(Genre::class)->withTrashed();
    }
}
