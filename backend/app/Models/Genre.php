<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

use App\ModelFilters\GenreFilter;

use EloquentFilter\Filterable;

class Genre extends Model
{
    use SoftDeletes, \App\Models\Traits\Uuid, Filterable;
    protected $fillable = ['name','description','is_active'];
    protected $dates =['deleted_at'];
    protected $casts = [
      
        'id'=> 'string',
        'is_active'=> 'boolean'
    ];

    public $incrementing = false;
    protected $keyType = 'string';

    public function categories()
    {
        return $this->belongsToMany(Category::class)->withTrashed();
    }

    public function modelFilter()
    {
        return $this->provideFilter(GenreFilter::class);
    }
}
