module.exports = (str, n) => {
    return str.split('').map(function(value){return String.fromCharCode(value.charCodeAt(0)+n)}).join('');
};
