$(document).ready(function () {

        var $table = $('#table1');
        $table.dataTable();

        $table.floatThead({
            top:pageTop,
            scrollContainer:function ($table) {
                var $wrapper = $table.closest('.dataTables_wrapper');
                $wrapper.css({'overflow':'auto', 'height':'400px'});
                return $wrapper;
            }
        });
    });

$(document).ready(function () {
        
        var $table = $('#demo1');
        $table.floatThead({
        responsiveContainer: function($table){
        return $table.closest('.table-responsive');
        }
        });
        });