<?
/*
    site-specific config
*/

$site_title = 'W-o-r-l-d-w-i-d-e-w-e-b';
$head = 'VIS 208';
$site = 'W-o-r-l-d-w-i-d-e-w-e-b';
$home = $head . ", " . $site;
$card_default = '/media/jpg/card-default.jpg';
$logo_src = '/media/jpg/logo.jpg';
$description = 'Hello, w-w-w-orld.';
$site_url = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off' ? 'https' : 'http';
$site_url .= '://' . $_SERVER['SERVER_NAME'];
$og_locale = 'en_US';
?>
