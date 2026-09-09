"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "_ssr_src_lib_api_mensaje-error_ts";
exports.ids = ["_ssr_src_lib_api_mensaje-error_ts"];
exports.modules = {

/***/ "(ssr)/./src/lib/api/mensaje-error.ts":
/*!**************************************!*\
  !*** ./src/lib/api/mensaje-error.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   mensajeErrorHttp: () => (/* binding */ mensajeErrorHttp)\n/* harmony export */ });\n/** Si el proxy devolvió HTML en vez de JSON, no lo mostramos crudo. */ async function mensajeErrorHttp(res, respaldo) {\n    const texto = await res.text();\n    const recorte = texto.trimStart().toLowerCase();\n    if (recorte.startsWith(\"<\") || recorte.startsWith(\"<!doctype\")) {\n        return \"servicio no encontrado\";\n    }\n    try {\n        const datos = JSON.parse(texto);\n        return datos.error || respaldo;\n    } catch  {\n        return \"servicio no encontrado\";\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9zcmMvbGliL2FwaS9tZW5zYWplLWVycm9yLnRzIiwibWFwcGluZ3MiOiI7Ozs7QUFBQSxxRUFBcUUsR0FDOUQsZUFBZUEsaUJBQ3BCQyxHQUFhLEVBQ2JDLFFBQWdCO0lBRWhCLE1BQU1DLFFBQVEsTUFBTUYsSUFBSUcsSUFBSTtJQUM1QixNQUFNQyxVQUFVRixNQUFNRyxTQUFTLEdBQUdDLFdBQVc7SUFDN0MsSUFBSUYsUUFBUUcsVUFBVSxDQUFDLFFBQVFILFFBQVFHLFVBQVUsQ0FBQyxjQUFjO1FBQzlELE9BQU87SUFDVDtJQUNBLElBQUk7UUFDRixNQUFNQyxRQUFRQyxLQUFLQyxLQUFLLENBQUNSO1FBQ3pCLE9BQU9NLE1BQU1HLEtBQUssSUFBSVY7SUFDeEIsRUFBRSxPQUFNO1FBQ04sT0FBTztJQUNUO0FBQ0YiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9tb2xpZW1wcmVuZGUtZnJvbnRlbmQvLi9zcmMvbGliL2FwaS9tZW5zYWplLWVycm9yLnRzP2QzNWEiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqIFNpIGVsIHByb3h5IGRldm9sdmnDsyBIVE1MIGVuIHZleiBkZSBKU09OLCBubyBsbyBtb3N0cmFtb3MgY3J1ZG8uICovXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBtZW5zYWplRXJyb3JIdHRwKFxyXG4gIHJlczogUmVzcG9uc2UsXHJcbiAgcmVzcGFsZG86IHN0cmluZ1xyXG4pOiBQcm9taXNlPHN0cmluZz4ge1xyXG4gIGNvbnN0IHRleHRvID0gYXdhaXQgcmVzLnRleHQoKTtcclxuICBjb25zdCByZWNvcnRlID0gdGV4dG8udHJpbVN0YXJ0KCkudG9Mb3dlckNhc2UoKTtcclxuICBpZiAocmVjb3J0ZS5zdGFydHNXaXRoKFwiPFwiKSB8fCByZWNvcnRlLnN0YXJ0c1dpdGgoXCI8IWRvY3R5cGVcIikpIHtcclxuICAgIHJldHVybiBcInNlcnZpY2lvIG5vIGVuY29udHJhZG9cIjtcclxuICB9XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IGRhdG9zID0gSlNPTi5wYXJzZSh0ZXh0bykgYXMgeyBlcnJvcj86IHN0cmluZyB9O1xyXG4gICAgcmV0dXJuIGRhdG9zLmVycm9yIHx8IHJlc3BhbGRvO1xyXG4gIH0gY2F0Y2gge1xyXG4gICAgcmV0dXJuIFwic2VydmljaW8gbm8gZW5jb250cmFkb1wiO1xyXG4gIH1cclxufVxyXG4iXSwibmFtZXMiOlsibWVuc2FqZUVycm9ySHR0cCIsInJlcyIsInJlc3BhbGRvIiwidGV4dG8iLCJ0ZXh0IiwicmVjb3J0ZSIsInRyaW1TdGFydCIsInRvTG93ZXJDYXNlIiwic3RhcnRzV2l0aCIsImRhdG9zIiwiSlNPTiIsInBhcnNlIiwiZXJyb3IiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./src/lib/api/mensaje-error.ts\n");

/***/ })

};
;