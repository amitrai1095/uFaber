const validurl = require("valid-url")
const path = require("path")
const urlencode = require("urlencode")
const fs = require("fs")
const mkdirp = require("mkdirp")
const cd = require("content-disposition")
const request = require("request")
const del = require("del")
const fileExists = require('file-exists')
const _ = require("underscore")
const Q = require("q")
const spawn = require('child_process').spawn
const curl = require('curl')

let utils = {
    PorcessOptions: ['--create-dirs', '--insecure', '--progress-bar', '--location', '--globoff'],
    ValidUrl: url => {
        console.log('validating url')
        return (!validurl.isUri(url)) ? false : true;
    },
    xtend: (target, source) => {
        console.log('xtend function')
        return _.extend(target, source);
    },
    getinfo: (saveas, res) => {
        console.log('getting request info')
        let size = res.headers["content-length"],
            returnObj = {
                saveas: saveas,
                filesize: size
            };
        if (saveas) return returnObj;

        if (res.headers['content-disposition']) {
            let filename = cd.parse(res.headers['content-disposition']).parameters.filename;
            returnObj.saveas = urlencode.decode(filename, "gbk");
        } else {
            if (res.req.path === "/") {
                returnObj.saveas = "index.html"
            } else {
                returnObj.saveas = urlencode.decode(path.basename(res.req.path), "gbk");
            }
        }
        return returnObj;
    },
    checkDir: function(path) {
        console.log('checking directory path')
        let self = this;
        if (!fs.existsSync(path)) {
            mkdirp(path, function(err) {
                if (err) self.emit("error", err);
            });
        }
        return path;
    },
    getonlineInfo: (url, fn) => {
        let d = Q.defer();
        console.log('getting file info')
        request.head(url, function(err, res) {
            d.resolve(res);
        });
        return d.promise;
    },
    getFilesize: function(file) {
        console.log('getting file size')
        return fileExists(file) ? fs.statSync(file)["size"] : 0;

    },
    fileDelete: function(file, fn) {
        console.log('deleting file')
        return del(file, { force: true });
    },
    download: (self, startFrom, already = false) => {
        console.log('starting download')
        let Args = utils.xtend([], utils.PorcessOptions),
            Norespond = false,
            speed = 0,
            now = { time: 0, data: 0 },
            previous = { time: new Date().getTime() / 1000, data: 0 },
            progress = 0;

        console.log('pushing filepath in args')
        Args.push("-o" + self.filePath);
        if (startFrom) Args.push('-C ' + startFrom);
        Args.push(self.options.url);
        console.log('spawning curl with args')
        self.curl = spawn("curl", Args);
        console.log('spawned curl with args')
        self.curl.stderr.on("data", data => {
            console.log('in data callback - util - 89')
            data = data.toString('ascii');
            if (data.indexOf("#") === -1) {
                if (Norespond) {
                    data = data.toString('ascii');
                    if (/\d+(\.\d{1,2})/.test(data)) {
                        if (!already) {
                            self.emit("start");
                        }

                        let dataWritten = utils.getFilesize(self.filePath),
                            size = self.fileinfo.filesize,
                            pr = parseFloat((dataWritten * 100) / size).toFixed(1);

                        progress = pr;

                        now = { time: new Date().getTime() / 1000, data: dataWritten };
                        let diff = now.time - previous.time
                        if (diff !== 0) {
                            speed = Math.floor((((now.data - previous.data) / (now.time - previous.time)) / 1024))
                        }
                        previous = utils.xtend({}, now);
                        console.log('setting progress event')
                        self.emit("progress", { 
                            progress: pr, 
                            dataWritten: 
                            dataWritten, 
                            filesize: size, 
                            speed: `${speed}KB/s` ,
                            url: self.options.url
                        });
                        already = true;
                    }
                } else {
                    Norespond = true;
                }
            }
        });
        self.curl.on('close', function(code) {
            console.log('in close callback')
            if (code !== null) {
                if (code === 0) {
                    if (progress === 0 && !fileExists(self.filePath)) return self.emit("error", 'Can\'t start the download');

                    const filesize = self.fileinfo.filesize,
                          dataWritten = utils.getFilesize(self.filePath);
                    console.log('sending 100% progress event')
                    self.emit("progress", {
                            progress: 100,
                            dataWritten: dataWritten,
                            filesize: filesize,
                            speed: 0,
                            url: self.options.url
                    });
                    console.log('sending end event')
                    self.emit("end", {
                        url : self.options.url,
                        filePath : self.filePath
                    });
                }
                if (code !== 0) {
                    self.emit("error", `Error: ${code}`);
                }
            }
        });
    },
    checkBeforeDownload: (self, options) => {
        console.log('checks before download')
        return Q.Promise((resolve, reject) => {
            if (fileExists(self.filePath)) {
                if (options.deleteIfExists) {
                    utils.fileDelete(self.filePath).then(() => {
                        resolve()
                    }).catch(err => {
                        reject(err.toString())
                    })
                } else {
                    let fileSizeInBytes = utils.getFilesize(self.filePath),
                        len = parseFloat(self.fileinfo.filesize);
                    if (options.resume) {
                        if (fileSizeInBytes === len) {
                            console.log('in check before - checking filesize')
                            self.emit("end");
                            reject();
                        } else {
                            resolve(fileSizeInBytes);
                        }
                    } else {
                        utils.fileDelete(self.filePath).then(() => {
                            d.resolve()
                        }).catch(err => {
                            reject(err.toString())
                        })
                    }
                }
            } else {
                resolve();
            }
        })
    }
}


module.exports = utils;
