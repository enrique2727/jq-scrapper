var fs = require('fs');
var querystring = require('querystring');
var request = require('request');
var cheerio = require('cheerio');
var Q = require('q');

exports.post = function (url, cb, data, headers) {
    var params = {
        url: encodeURI(url),
        method: 'POST',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/535.11 (KHTML, like Gecko) Safari/535.11',
            'Referer': url
        }},
        callDeferred = Q.defer();

    if (typeof data == 'object') {
        params.body = querystring.stringify(data);
    }

    if (typeof headers == 'object') {
        for (var key in headers) {
            params.headers[key] = headers[key];
        }
    }

    request(params, function (err, res, body) {
        if (err) {
            if(cb) cb(err);
            callDeferred.reject(err);
        }else {
            exports.load(body, function($){
                callDeferred.resolve($);
            });
        }

    });

    return callDeferred.promise;
}
    
exports.get = function (url, cb, data, headers) {
    if (typeof data == 'object') {
        url += (url.substr(-1) == "?") ? '' : '?';
        url += querystring.stringify(data);
    }

    var params = {
        url: encodeURI(url),
        method: 'GET',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/535.11 (KHTML, like Gecko) Safari/535.11',
            'Referer': url
        }},
        callDeferred = Q.defer();

    if (typeof headers == 'object') {
        for (var key in headers) {
            params.headers[key] = headers[key];
        }
    }

    request(params, function (err, res, body) {
        if (err) { 
            if(cb) cb(err);
            callDeferred.reject(err);
        } else {
            exports.load(body, function($){
                callDeferred.resolve($);
            });
        }
    });

    return callDeferred.promise;
}

exports.load = function (html, cb) {
    var jq = cheerio.load(html);

    if (cb) cb.call(jq, jq);
}

