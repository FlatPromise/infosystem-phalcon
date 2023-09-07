<?php

declare(strict_types=1);

use Phalcon\Http\Request;
use Phalcon\Mvc\Model\Query;

class UsersController extends \Phalcon\Mvc\Controller
{

    public function indexAction()
    {
        //TODO: CONNECT TO DB AND GET INFO FOR $userlist
        //DEFAULT VALUE
        $userlist = array(
            [
                "fname" => "Edgar",
                "mname" => "",
                "lname" => "Cerda",
                "email" => "epicerds2@gmail.com",
                "bday" => "2002-05-04",
                "address" => "9049 San Nicolas",
                "contact" => "09275461148",
                "hobbies" => "Gaming"
            ],
            [
                "fname" => "John",
                "mname" => "D",
                "lname" => "Doe",
                "email" => "junniboy@yahoo.com",
                "bday" => "2000-03-12",
                "address" => "123 Sample Address, 16 Blocks",
                "contact" => "09123123432",
                "hobbies" => "Ewan"
            ]
        );

        //reset array for data collection from SQL
        $userlist = array();
        $users = $this->modelsManager->executeQuery(
            'SELECT * FROM Users WHERE status = :status:',
            [
                'status' => 1,
            ]
        );

        foreach ($users as $value) {
            array_push(
                $userlist,
                [
                    "id" => $value->id,
                    "fname" => $value->fname,
                    "mname" => $value->mname,
                    "lname" => $value->lname,
                    "email" => $value->email,
                    "bday" =>  $value->bday,
                    "address" => $value->address,
                    "contact" => $value->contact,
                ]
            );
        }

        $this->view->setVar('userlist', $userlist);
    }

    public function createAction()
    {
        $request = new Request();
        if ($request->isPost()) {
            $this->view->disable();

            $fname = $request->getPost('fname');
            $mname = $request->getPost('mname') ?? '';
            $lname = $request->getPost('lname');

            $email = $request->getPost('email');
            $address = $request->getPost('address');
            $contact = $request->getPost('contact');

            $hobbies = explode(',', $request->getPost('hobbies'));

            $bday = $request->getPost('bday');

            try {
                $userToCreate = new Users();
                $userToCreate->fname = $fname;
                $userToCreate->mname = $mname;
                $userToCreate->lname = $lname;
                $userToCreate->email = $email;
                $userToCreate->address = $address;
                $userToCreate->contact = $contact;
                $userToCreate->bday = $bday;

                if ($userToCreate->save()) {

                    $targetId = $userToCreate->id;
                    foreach ($hobbies as $value) {
                        $hobbyModel = new Hobbies();
                        $hobbyModel->user_id = $targetId;
                        $hobbyModel->hobby_entry = $value;
                        $hobbyModel->save();
                    }
                } else {
                    foreach ($userToCreate->getMessages() as $value) {
                        echo '<p>' . $value . '</p>';
                    }
                }
                echo 'Success';
            } catch (\Throwable $th) {
                echo $th;
            }
        }
    }

    public function editAction()
    {
        $request = new Request();
        if ($request->isPost()) {
            $this->view->disable();

            $fname = $request->getPost('fname');
            $mname = $request->getPost('mname') ?? '';
            $lname = $request->getPost('lname');

            $email = $request->getPost('email');
            $address = $request->getPost('address');
            $contact = $request->getPost('contact');

            $hobbies = explode(',', $request->getPost('hobbies'));

            $bday = $request->getPost('bday');

            try {
                $updatedUserRecord = Users::findFirst(
                    [
                        'conditions' => 'id=?1',
                        'bind' => [
                            1 => $request->getPost('user-id')
                        ]
                    ]
                );
                $updatedUserRecord->fname = $fname;
                $updatedUserRecord->mname = $mname;
                $updatedUserRecord->lname = $lname;
                $updatedUserRecord->email = $email;
                $updatedUserRecord->address = $address;
                $updatedUserRecord->contact = $contact;
                $updatedUserRecord->bday = $bday;

                if ($updatedUserRecord->update()) {
                    $hobbiesToDelete = Hobbies::find(
                        [
                            'conditions' => 'user_id = ?1',
                            'bind' => [1 => $request->getPost('user-id')]
                        ]
                    );
                    foreach ($hobbiesToDelete as $hobby) {
                        $hobby->delete();
                    }

                    foreach ($hobbies as $value) {
                        $hobbyModel = new Hobbies();
                        $hobbyModel->user_id = $request->getPost('user-id');
                        $hobbyModel->hobby_entry = $value;
                        $hobbyModel->save();
                    }
                } else {
                    foreach ($updatedUserRecord->getMessages() as $value) {
                        echo '<p>' . $value . '</p>';
                    }
                }

                echo 'Success';
            } catch (\Throwable $th) {
                echo $th->getMessage();
            }
        } else {
            $targetId = $request->get('target-id');
            $user = Users::findFirst(
                [
                    'conditions' => 'id=?1',
                    'bind' => [
                        '1' => $targetId
                    ]
                ]
            );
            $this->view->setVar('fname', $user->fname);
            $this->view->setVar('lname', $user->lname);
            $this->view->setVar('mname', $user->mname);
            $this->view->setVar('email', $user->email);
            $this->view->setVar('bday', $user->bday);
            $this->view->setVar('address', $user->address);
            $this->view->setVar('contact', $user->contact);

            $hobbies = Hobbies::find(
                [
                    'conditions' => 'user_id = ?1',
                    'bind' => [
                        1 => $request->get('target-id')
                    ]
                ]
            );
            $hobbyEntries = array();
            foreach ($hobbies as $value) {
                array_push($hobbyEntries, $value->hobby_entry);
            }
            $this->view->setVar('hobbyEntries', $hobbyEntries);
        }
    }

    public function viewuserAction()
    {
        $request = new Request();
        if ($request->get('target-id')) {
            $targetId = $request->get('target-id');

            $user = Users::findFirst(
                [
                    'conditions' => 'id=?1',
                    'bind' => [
                        '1' => $targetId
                    ]
                ]
            );

            $hobbies = Hobbies::find(
                [
                    'conditions' => 'user_id=?1',
                    'bind' => [
                        1 => $targetId
                    ]
                ]
            );

            if ($user) {
                $this->view->setVar('fname', $user->fname);
                $this->view->setVar('mname', $user->mname);
                $this->view->setVar('lname', $user->lname);
                $this->view->setVar('email', $user->email);
                $this->view->setVar('bday', $user->bday);
                $this->view->setVar('contact', $user->contact);
                $this->view->setVar('address', $user->address);
            }


            $caughtHobbies = [];
            if ($hobbies) {
                foreach ($hobbies as $hobby) {
                    array_push($caughtHobbies, $hobby->hobby_entry);
                }
            }
            $this->view->setVar('caughtHobbies', $caughtHobbies);
        } else {
            $this->dispatcher->forward(
                ['controller' => 'users', 'action' => 'index']
            );
        }
    }

    public function deleteAction()
    {
        $request = new Request();
        $this->view->disable();
        if ($request->get('target-user')) {
            $user = Users::findFirst(
                [
                    'conditions' => 'id=?1',
                    'bind' => [1 => $request->get('target-user')]
                ]
            );
            $user->status = 0;
            if ($user->update()) {
                echo 'deleted';
            }
        }
    }
}
