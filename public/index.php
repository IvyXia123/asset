<?php

use Phalcon\Loader;
use Phalcon\Mvc\View;
use Phalcon\Mvc\Application;
use Phalcon\Di\FactoryDefault;
use Asset\Plugins\ActionAcl,
    Phalcon\Mvc\Dispatcher,
    Phalcon\Crypt,
    Phalcon\Mvc\Router,
    Phalcon\Events\Event;

try {

//    $debug = new \Phalcon\Debug();
//    $debug->listen();

    $loader = new Loader();
    $loader->registerNamespaces(
            array(
                'Asset\Utils' => '../app/utils/',
                'Asset\Plugins' => '../app/plugins/',
                'Asset\Controllers' => '../app/controllers/',
            )
    );
    $loader->registerDirs(array(
        '../app/controllers/',
        '../app/models/',
        '../app/conf/'
    ));
    $loader->register();

    $di = new FactoryDefault();

    $di->set('view', function () {
        $view = new View();
        $view->setViewsDir('../app/views/');
        return $view;
    });

//    $di->set('dispatcher', function() use ($di) {
//        $dispatcher = new Dispatcher();
//        $dispatcher->setDefaultNamespace("Asset\Controllers");
//
//        $eventsManager = $di->getShared('eventsManager');
//
//        $eventsManager->attach(
//                "dispatch:beforeException", function (Event $event, Dispatcher $dispatcher, Exception $exception) {
//            // 处理404异常
//            if ($exception instanceof DispatchException) {
//                $dispatcher->forward(
//                        [
//                            "controller" => "index",
//                            "action" => "show404",
//                        ]
//                );
//
//                return false;
//            }
//
//            // 代替控制器或者动作不存在时的路径
//            switch ($exception->getCode()) {
//                case Dispatcher::EXCEPTION_HANDLER_NOT_FOUND:
//                case Dispatcher::EXCEPTION_ACTION_NOT_FOUND:
//                    $dispatcher->forward(
//                            [
//                                "controller" => "index",
//                                "action" => "show404",
//                            ]
//                    );
//                    return false;
//            }
//        }
//        );
//
////        $actionAcl = new ActionAcl($di);
////        $eventsManager->attach('dispatch', $actionAcl);
//
//        $dispatcher->setEventsManager($eventsManager);
//
//        return $dispatcher;
//    });
    
    $di->set('dispatcher', function() use ($di) {
        $dispatcher = new Dispatcher();
        $dispatcher->setDefaultNamespace("Asset\Controllers");

        $eventsManager = $di->getShared('eventsManager');
        $actionAcl = new ActionAcl($di);
        $eventsManager->attach('dispatch', $actionAcl);

        $dispatcher->setEventsManager($eventsManager);

        return $dispatcher;
    });

    $di->set('router', function () {

        $router = new Router();
        $router->add("/pages/{page}", array(
            'controller' => 'pages',
            'action' => 'index',
            'page' => 1
        ));
//        $router->add("/reports", array(
//            'controller' => 'reports',
//            'action' => 'index'
//        ));

        return $router;
    });

    $di->set('crypt', function() {
        $crypt = new Crypt();
        $crypt->setKey('zhaopeng12345678');
        return $crypt;
    });

//    $services = $di->getServices();
//    foreach ($services as $key => $value) {
//        var_dump($key);
//        var_dump(get_class($di->get($key)));
//    }

    $application = new Application($di);

    echo $application->handle()->getContent();
} catch (\Exception $e) {
    echo "Exception: ", $e->getMessage();
}