<?php

header('Content-Type: text/plain');

require_once __dir__ . 'config.php';

$data = urlencode($_GET[$key]);

echo file_get_contents("{$url}?{$key}={$data}");
