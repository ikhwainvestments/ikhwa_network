<?php

// تأكد أن الطلب من نوع POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['message' => 'الطريقة غير مسموحة']);
    exit;
}

// عنوان الـ API الخاص بالوظائف
$apiUrl = 'http://api.ikhwadigital.com/api/ikhwanetwork/job';

// تجهيز الحقول
$fields = [
    'name'        => $_POST['name']        ?? '',
    'email'       => $_POST['email']       ?? '',
    'phone'       => $_POST['phone']       ?? '',
    'birthdate'   => $_POST['birthdate']   ?? '',
    'address'     => $_POST['address']     ?? '',
    'education'   => $_POST['education']   ?? '',
    'description' => $_POST['description'] ?? '',
    'option'      => $_POST['option']      ?? '',
];

// رفع الملف إن وُجد
if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
    $filePath = $_FILES['file']['tmp_name'];
    $fileName = $_FILES['file']['name'];
    $fileType = $_FILES['file']['type'];

    $fields['file'] = new CURLFile($filePath, $fileType, $fileName);
}

// تنفيذ الطلب باستخدام cURL
$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

// التحقق من الأخطاء
if (curl_errno($ch)) {
    http_response_code(500);
    echo json_encode(['message' => 'فشل الاتصال بالخادم']);
    exit;
}

curl_close($ch);

// عرض الرد من الخادم
http_response_code($httpCode);
header('Content-Type: application/json');
echo $response;
