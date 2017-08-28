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
    return gulp.src("./src/webui/webui.ts")
      .pipe(webpack(require("./webpack.config.js")))
      .pipe(gulp.dest("./build"));
});

gulp.task("default", [ "jison", "bundle" ]);