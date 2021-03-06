<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBackstagesTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{				
		Schema::create('backstages', function(Blueprint $table)
		{
			//台前幕后
			$table->increments('id');
			$table->string('title');//标题
			$table->longtext('content');//内容
			$table->timestamps();
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('backstages');
	}

}
