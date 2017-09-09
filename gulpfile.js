var gulp = require("gulp");
var jison = require("gulp-jison");
var webpack = require("gulp-webpack");

gulp.task("jison", function(){
    return gulp.src("./src/parser/jison-parser.jison")
        .pipe(jison({ 
            moduleType: "commonjs"}))
        .pipe(gulp.dest("./src/parser/"));
});

gulp.task("bundle", function () {
      webpack( 
          require("./webpack.config.js")
        );
});

gulp.task("default", [ "jison", "bundle" ]);