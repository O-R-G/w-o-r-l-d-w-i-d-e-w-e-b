<? 
/*
    edit $badge per site
    plus .js src
*/

?>
<script src='https://cdnjs.cloudflare.com/ajax/libs/three.js/r76/three.min.js'></script>
<?

$badge = "<canvas id='clock-canvas' class='centre'>loading...</canvas>";

if(!$uu->id) {
    ?><div id='badge-container' class='centre'>
        <div id='badge' class='large badge'>

        </div>
    </div>
    <!-- <script>badge.init("clock-canvas", "centre", true);</script> -->
    <?
} else {
    if($show_menu) {
        ?><div id="badge-container" class="lower-right">
            <div id='badge' class='small badge'>

            </div>
        </div><?
    } else {
        ?><div id="badge-container" class="lower-right">
            <div id='badge' class='small badge'>
            </div>
        </div><?
    }
    if($show_menu) {
        ?>
            <!-- <script>badge.init("clock-canvas", "lower-right", false);</script> -->
        <?
    } else {
        ?>
            <!-- <script>badge.init("clock-canvas", "lower-right", true);</script> -->
        <?
    }
}
?>
<script type='text/javascript' src='/static/js/badge.js?v=2025120901'></script>
<script type='text/javascript' src='/static/js/global.js'></script>
<script type='text/javascript' src='/static/js/menu.js'></script>
