<?php

declare(strict_types=1);

namespace App\Rules;

use App\Rules\GenresHasCategoriesRule;
use Mockery\MockInterface;
use PHPUnit\Framework\TestCase;


class GenresHasCategoriesRuleUnitTest extends TestCase
{

    public function testCategoriesIdField()
    {
        $rule = new GenresHasCategoriesRule([1, 1, 2, 2]);

        $reflectionClass = new \ReflectionClass(GenresHasCategoriesRule::class);
        $reflectionProperty = $reflectionClass->getProperty('categoriesId');
        $reflectionProperty->setAccessible(true);

        $categoriesId = $reflectionProperty->getValue($rule);
        $this->assertEqualsCanonicalizing([1, 2], $categoriesId);
    }

    public function testGenresIdValue()
    {

        $rule = $this->createRuleMock([]);
        $rule->shouldReceive('getRows')
            ->withAnyArgs()
            ->andReturnNull();

        $reflectionClass = new \ReflectionClass(GenresHasCategoriesRule::class);
        $reflectionProperty = $reflectionClass->getProperty('genresId');
        $reflectionProperty->setAccessible(true);

        $rule->passes('', [1, 1, 2, 2]);


        $genresId = $reflectionProperty->getValue($rule);
        $this->assertEqualsCanonicalizing([1, 2], $genresId);
    }

    public function testPassesReturnsFalseWhenCategoriesOrGenresIsArrayEmpty()
    {
        $rules = $this->createRuleMock([1]);
        $this->assertFalse($rules->passes('', []));

        $rule = $this->createRuleMock([]);
        $this->assertFalse($rule->passes('', [1]));
    }

    public function testPAssesReturnsFalseWhenGetRowIsEmpty()
    {
        $rule = $this->createRuleMock([1]);
        $rule->shouldReceive('getRows')
            ->WithAnyArgs()
            ->andReturn(collect());

        $this->assertFalse($rule->passes('', [1]));
    }

    public function testPassesReturnFalseWhenHasCategoriesWithoutGenres()
    {
        $rule = $this->createRuleMock([1, 2]);
        $rule
            ->shouldReceive('getRows')
            ->withAnyArgs()
            ->andReturn(collect(['category_id' => 1]));

        $this->assertFalse($rule->passes('', [1]));
    }

    public function testPAssesIsValid()
    {
        $rule = $this->createRuleMock([1, 2]);
        $rule
            ->shouldReceive('getRows')
            ->withAnyArgs()
            ->andReturn(collect([
                ['category_id' => 1],
                ['category_id' => 2]
            ]));

        $this->assertTrue($rule->passes('', [1]));
    }

    protected function createRuleMock(array $categoriesId): MockInterface
    {
        return \Mockery::mock(GenresHasCategoriesRule::class, [$categoriesId])
            ->makePartial()
            ->shouldAllowMockingProtectedMethods();
    }
}
