// import domtoimage from 'dom-to-image';

// const takeScreenshot = () => {
//     const element = document.getElementById('target-element'); // 替换为需要截图的元素的 id 或类名
//     if (element) {
//         domtoimage.toPng(element)
//             .then(function (dataUrl) {
//                 // 生成截图的 data URL
//                 console.log(dataUrl);
//             })
//             .catch(function (error) {
//                 console.error('截图生成失败:', error);
//             });
//     }
// };

import html2canvas from 'html2canvas';

export const takeScreenshot = async () => {
    console.log("taking shot...");
    const element = document.getElementById("schedule-table"); // 替换为需要截图的元素的 id 或类名
    if (element) {
        const dataUrl = html2canvas(element).then(canvas => {
            return canvas.toDataURL(); // 将 Canvas 转换为 data URL
            // console.log(dataUrl);
            // const img = new Image();
            // img.src = dataUrl;
            // document.body.appendChild(img);
            // const binaryData = atob(dataUrl.split(',')[1]); // 将 base64 编码的字符串转换为二进制数据
            // const blob = new Blob([binaryData], { type: 'image/png' }); // 创建新的 Blob 对象
            // const url = URL.createObjectURL(blob); // 将 Blob 对象转换为 URL
            // console.log(url);   
        });
        return dataUrl;
    }
    return undefined;
};