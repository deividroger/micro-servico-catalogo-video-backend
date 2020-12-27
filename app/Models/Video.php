<?php

namespace App\Models;

use App\Models\Traits\Uuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Video extends Model
{
    use SoftDeletes, Uuid;

    const RATING_LIST = ['L', '10', '12', '14', '16', '18'];

    protected $fillable = [
        'title',
        'description',
        'year_launched',
        'opened',
        'rating',
        'duration'
    ];
    protected $dates  = ['deleted_at'];

    protected $casts = [
        'id' => 'string',
        'opened' => 'boolean',
        'year_launched' => 'integer',
        'duration' => 'integer'
    ];

    public $incrementing = false;

    public static function  create(array $attributes = [])
    {

        try {
            \DB::beginTransaction();

            $obj = static::query()->create($attributes);

            static::handleRelations($obj,$attributes);

            //upload aqui

            \DB::commit();
            return $obj;
        } catch (\Exception $ex) {
           
            if(isset($obj)){
                //excluir arqauivos de upload
            }
           
            \DB::rollBack();
            throw $ex;
        }
      
    }

    public function update(array $attributes = [], array $options = [])
    {
        try {
            \DB::beginTransaction();

            $saved = parent::update($attributes,$options);
            static::handleRelations($this,$attributes);

            if($saved){
             //upload aqui
             //excluir aquivos antigos
            }

            \DB::commit();

            return $saved;
        } catch (\Exception $ex) {
           
            //excluir arqauivos de upload
           
            \DB::rollBack();
            throw $ex;
        }
        
    }

    public static function handleRelations (Video $video, array $attributes){

        if(isset($attributes['categories_id'])){
            $video->categories()->sync($attributes['categories_id']);
        }

        if(isset($attributes['genres_id'])){
            $video->genres()->sync($attributes['genres_id']);
        }
    }


    public function categories()
    {
        return $this->belongsToMany(Category::class)->withTrashed();
    }

    public function genres()
    {
        return $this->belongsToMany(Genre::class)->withTrashed();
    }
}
