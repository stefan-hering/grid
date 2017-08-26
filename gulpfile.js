var gulp = require("gulp");
var jison = require("gulp-jison");
var rename  = require("gulp-rename");

gulp.task("jison", ["jison-compile", "jison-rename"]);

gulp.task("jison-compile", function(){
    return gulp.src("./src/parser/parser.jison")
        .pipe(jison({ 
            moduleType: "commonjs"}))
        .pipe(gulp.dest("./src/parser/"));
});

gulp.task("jison-rename", function(){
    return gulp.src("./src/parser/parser.js")
     .pipe(rename("jison-parser.js"))
     .pipe(gulp.dest("./src/parser"));
});


gulp.task("default", [ "jison" ]);