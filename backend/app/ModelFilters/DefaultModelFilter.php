<?php 

namespace App\ModelFilters;

use EloquentFilter\ModelFilter;
use Str;

abstract class DefaultModelFilter extends ModelFilter
{
    protected $sortable = [];

    protected function setUp()
    {
        $this->blacklistMethod('isSortable');

        $noSort = $this->input('sort','') === '';

        if($noSort){
            $this->orderBy('created_at','DESC');
        }
    }

    public function sort($column) {

        if(method_exists($this,$method= 'sortBy' . Str::studly($column) )){
            $this->method();
        }


        if($this->isSortable($column)){
         $dir =  strtolower( $this->input('dir')) == 'asc' ? 'ASC' : 'DESC';
         $this->orderBy($column,$dir) ;
        }
    }

    public function isSortable($column) {
        return in_array($column,$this->sortable);
    }
}
