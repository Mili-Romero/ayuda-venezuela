<?php
// 1. Cabeceras de seguridad y permisos (CORS)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 2. Solo aceptar peticiones POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Método no permitido."]);
    exit();
}

// 3. Capturar y procesar el JSON de Vue
$jsonInput = file_get_contents("php://input");
$data = json_decode($jsonInput, true);

if (empty($data['name']) || empty($data['email']) || empty($data['message'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Todos los campos son obligatorios."]);
    exit();
}

// 4. Capa de Seguridad: Sanitización estricta contra hackeos
$nombre    = strip_tags(trim($data['name']));
$remitente = filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL);
$mensaje   = htmlspecialchars(trim($data['message']));

if (!filter_var($remitente, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "El correo electrónico no es válido."]);
    exit();
}

// 5. CONFIGURACIÓN DEL EMAIL (BanaHosting)
$destinatario = "Info@plasist.org"; // Correo donde te llegarán los mensajes
$asunto       = "Nuevo mensaje de ayuda: " . $nombre;

$cuerpoCorreo  = "Has recibido un mensaje desde el formulario de contacto.\n\n";
$cuerpoCorreo .= "Nombre: " . $nombre . "\n";
$cuerpoCorreo .= "Correo: " . $remitente . "\n\n";
$cuerpoCorreo .= "Mensaje:\n" . $mensaje . "\n";

// El 'From' DEBE ser un correo real creado en tu cPanel de BanaHosting
$correoCorporativo = "no-reply@plasist.org"; 

$headers  = "From: Plataforma Plasist <" . $correoCorporativo . ">\r\n";
$headers .= "Reply-To: " . $remitente . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// 6. Envío del correo
if (mail($destinatario, $asunto, $cuerpoCorreo, $headers)) {
    http_response_code(200);
    echo json_encode(["success" => true, "message" => "Mensaje enviado."]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error al enviar."]);
}
?>
