<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use EloquentFilter\Filterable;

abstract class BasicCrudController extends Controller
{
    protected $defaultPerPage = 15;

    protected abstract function model();

    protected abstract function rulesStore();

    protected abstract function rulesUpdate();

    protected abstract function resource();

    protected abstract function resourceCollection();

    public function index(Request $request)
    {
        $perPage = (int)$request->get('per_page', $this->defaultPerPage);

        $hasFilter = in_array(Filterable::class, class_uses($this->model()));

        $query = $this->queryBuilder();

        if ($hasFilter) {
            $query = $query->filter($request->all());
        }

        $data = $request->has('all') || !$this->defaultPerPage
            ?    $query->get()
            : $query->paginate($perPage);

        $resourceCollectionClass = $this->resourceCollection();

        $refClass =  new \ReflectionClass($this->resourceCollection());

        return $refClass->isSubclassOf(ResourceCollection::class) ?
            new $resourceCollectionClass($data)
            : $resourceCollectionClass::collection($data);
    }

    public function store(Request $request)
    {
        $validateData = $this->validate($request, $this->rulesStore());

        $obj =  $this->queryBuilder()->create($validateData);

        $obj->refresh();

        $resource = $this->resource();

        return new $resource($obj);
    }

    protected function findOrFail($id)
    {

        $model = $this->model();
        $keyName = (new $model)->getRouteKeyName();
        return $this->queryBUilder()->where($keyName, $id)->firstOrFail();
    }

    public function show($id)
    {
        $obj = $this->findOrFail($id);

        $resource = $this->resource();

        return new $resource($obj);
    }

    public function update(Request $request, $id)
    {
        $obj = $this->findOrFail($id);
        
        $validatedData = $this->validate(
            $request,
            $request->isMethod('PUT') ? $this->rulesUpdate() : $this->rulesPatch()
        );

        $obj->update($validatedData);

        $resource = $this->resource();

        return new $resource($obj);
    }

    protected function rulesPatch()
    {
        return array_map(function ($rules) {
            if (is_array($rules)) {
                $exists = in_array("required", $rules);
                if ($exists) {
                    array_unshift($rules, "sometimes");
                }
            } else {
                return str_replace("required", "sometimes|required", $rules);
            }
            return $rules;
        }, $this->rulesUpdate());
    }

    public function destroy($id)
    {
        $obj = $this->findOrFail($id);
        $obj->delete();
        return response()->noContent();
    }

    public function destroyCollection(Request $request)
    {

        $data = $this->validateIds($request);
        $this->model()::whereIn('id', $data['ids'])->delete();

        return response()->noContent();
    }

    protected function validateIds($request)
    {
        $model = $this->model();
        $ids = explode(',', $request->get('ids'));
        $validator = \Validator::make([
            'ids'   => $ids
        ], [
            'ids' => 'required|exists:' . (new $model)->getTable() . ',id'
        ]);

        return $validator->validate();
    }



    protected function queryBuilder(): Builder
    {
        return $this->model()::query();
    }
}
