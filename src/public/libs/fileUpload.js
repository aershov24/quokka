jQuery(document).ready(function() {
    $('#file-upload').on('change.bs.fileinput', function(event) {
        event.stopPropagation();
        alert("yy");
        console.log(event);
    });
});