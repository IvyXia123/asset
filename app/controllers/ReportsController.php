<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
namespace Asset\Controllers;

use Phalcon\Mvc\Controller;
use ClusterMan\utils\MySqlDB;

class ReportsController extends Controller {
    
    public function indexAction() {
        $page = $this->dispatcher->getParam("page");
        if($page){
            $this->view->pick("reports/".$page);
        }
    }
    
    public function aAction() {
        
    }
    
    public function bAction() {
        
    }
    
    public function testAction() {
        
    }

}
