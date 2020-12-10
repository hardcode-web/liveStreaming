/* 통신 및 IO 관련 모듈 */
var http = require('http');
var fs = require('fs');


/* 에러 메세지  출력*/ 
function error_404(response){
    response.writeHead(404, {'Content-Type':"text/plain"});
    response.write("TEST: 404 Error.");
    response.end();
}


/* 운영서버 메인 루틴 */
/* Todo: 클라이언트에게 View 전달 */
function webServerHandler(request, response) {
    if (request.method == 'GET') {
        response.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'});
        fs.createReadStream("client" + request.url).pipe(response);
    } else {
        response.writeHead(404,{'Content-Type':'text/plain'});
        response.write(request.method);
        response.write(request.url);
		response.end();
    }
}


/* 미디어서버 메인 루틴 */
function mediaServerHandler(request, response) {
	
	/* 영상 요청 처리 */
	switch(request.method){	
		case 'GET':
			response.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'});
			if (request.url == '/') {
				/* Root Url로 접속시 비디오 테스트용 HTML 페이지 출력 */
				fs.createReadStream("./tests/mp4_hls_test.html").pipe(response);
			}
			else if (request.url.includes('/videos') || request.url.includes('/streams')) {
				/* REST API: 미디어 (비디오 & 스트림) 요청시 해당 미디어 파일 반환 */
				fs.createReadStream("./resources" + request.url).pipe(response);
				console.log("Resource requested: " + request.url);
				console.log("Resource fetched from filesystem: " + "./resources" + request.url);		
			}
			break;
			
			
		case 'POST':
			/* Todo: 비디오 업로드 루틴 추가 */
			if (request.url.includes('/videos') || request.url.includes('/streams')) {
				/* REST API: 미디어 (비디오 & 스트림) 요청시 해당 미디어 파일 반환 */
				fs.createReadStream("./resources" + request.url).pipe(response);
				console.log("Writing mp4 video to: " + request.url);		
			}
			break;
		
		
		case 'DELETE':
			/* Todo: 비디오 삭제 루틴 추가 */
			break;
		
		
		case 'UPDATE':
			/* UPDATE 요청은 사용하지 않는다 */
			response.writeHead(404, {'Content-Type':'text/plain'});
			response.write(request.method);
			response.write(request.url);
			console.log('Test Message: 404 Error!');
			response.end();
			break;
			
			
		default:
			response.writeHead(404, {'Content-Type':'text/plain'});
			response.write(request.method);
			response.write(request.url);
			console.log('Test Message: 404 Error!');
			response.end();
			break;
	}
}




/** 
 *	웹서버 및 미디어 서버 생성
 *
 *	웹서버: 포트 80
 * 	미디어 서버: 포트 8080
 */

/* 웹서버 : 포트 80 */
http.createServer(webServerHandler).listen(80);
console.log('Web server started!');


/* 미디어서버: 포트 8080 */
http.createServer(mediaServerHandler).listen(8080);
console.log('Media server started!');
