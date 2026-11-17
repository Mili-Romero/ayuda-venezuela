<?php
declare(strict_types=1);

require_once __DIR__ . '/db_connect.php';

function responder(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST, OPTIONS');
    responder(405, ['success' => false, 'message' => 'Método no permitido.']);
}

$token = $_SERVER['HTTP_X_SESSION_ID'] ?? '';
if (!is_string($token) || !preg_match('/^[A-Za-z0-9,-]{16,128}$/', $token)) {
    responder(401, ['success' => false, 'message' => 'Se requiere una sesión válida.']);
}

session_id($token);
if (!session_start() || !isset($_SESSION['authenticated_user_id'])) {
    responder(401, ['success' => false, 'message' => 'Se requiere una sesión válida.']);
}
session_write_close();

$input = json_decode(file_get_contents('php://input'), true);
if (
    json_last_error() !== JSON_ERROR_NONE
    || !is_array($input)
    || !array_key_exists('id', $input)
    || !(is_int($input['id']) || (is_string($input['id']) && ctype_digit($input['id'])))
) {
    responder(400, ['success' => false, 'message' => 'El ID de la publicación no es válido.']);
}

$id = filter_var($input['id'], FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
if ($id === false) {
    responder(400, ['success' => false, 'message' => 'El ID de la publicación no es válido.']);
}

try {
    $statement = $pdo->prepare('DELETE FROM publicaciones WHERE id = :id');
    $statement->execute(['id' => $id]);

    if ($statement->rowCount() === 0) {
        responder(404, ['success' => false, 'message' => 'No se encontró la publicación.']);
    }

    responder(200, [
        'success' => true,
        'message' => 'Publicación eliminada.',
    ]);
} catch (PDOException $exception) {
    error_log('eliminar_dato.php: ' . $exception->getMessage());
    responder(500, ['success' => false, 'message' => 'Error al eliminar la publicación.']);
}
