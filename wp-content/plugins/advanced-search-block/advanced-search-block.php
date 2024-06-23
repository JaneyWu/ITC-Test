<?php
/**
 * Plugin Name:       Advanced Search Block
 * Description:       A Gutenberg block for advanced search functionality.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            JaneyWu
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       advanced-search-block
 *
 * @package CreateBlock
 */

if (!defined('ABSPATH')) {
	exit; // Exit if accessed directly.
}
function create_block_advanced_search_block_block_init()
{
	register_block_type(__DIR__ . '/build');
}
add_action('init', 'create_block_advanced_search_block_block_init');


function enqueue_wp_components_styles() {
    // Enqueue the default styles for the wp-components package
    wp_enqueue_style(
        'wp-components-css',
        includes_url('/css/dist/components/style.min.css'),
        array(),
        filemtime(ABSPATH . WPINC . '/css/dist/components/style.min.css')
    );
}
add_action('wp_enqueue_scripts', 'enqueue_wp_components_styles');

function advanced_search_block_frontend_assets() {
    // Enqueue the block's CSS for the frontend
    wp_enqueue_style(
        'advanced_search_block-frontend-css',
        plugins_url('build/style-view.css', __FILE__), // Path to your custom CSS file
        array(),
        filemtime(plugin_dir_path(__FILE__) . 'style.css')
    );
}
add_action('wp_enqueue_scripts', 'advanced_search_block_frontend_assets');