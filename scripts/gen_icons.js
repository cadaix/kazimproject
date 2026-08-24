import fs from 'fs';
import zlib from 'zlib';
import path from 'path';

function createPngBuffer(width, height) {
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // Bit depth
  ihdrData[9] = 6; // Color type: RGBA
  ihdrData[10] = 0; // Compression method
  ihdrData[11] = 0; // Filter method
  ihdrData[12] = 0; // Interlace method

  const ihdrChunk = createChunk('IHDR', ihdrData);

  // Raw image data with scanline filter (0 = None)
  const rawData = Buffer.alloc(height * (1 + width * 4));
  let offset = 0;

  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // Filter type 0
    const py = y / height;

    for (let x = 0; x < width; x++) {
      const px = x / width;
      // Dark slate with cyan/rose accent
      const r = Math.round(15 + 40 * px);
      const g = Math.round(23 + 60 * (1 - py));
      const b = Math.round(42 + 80 * py);
      const a = 255;

      rawData[offset++] = r;
      rawData[offset++] = g;
      rawData[offset++] = b;
      rawData[offset++] = a;
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressedData);

  // IEND chunk
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const length = data.length;
  const buffer = Buffer.alloc(8 + length + 4);
  buffer.writeUInt32BE(length, 0);
  buffer.write(type, 4, 4, 'ascii');
  data.copy(buffer, 8);

  const crc = calculateCrc(buffer.subarray(4, 8 + length));
  buffer.writeUInt32BE(crc, 8 + length);
  return buffer;
}

// CRC32 table & calculation
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) c = 0xedb88320 ^ (c >>> 1);
    else c = c >>> 1;
  }
  crcTable[n] = c;
}

function calculateCrc(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

const pubDir = path.resolve('public');
fs.writeFileSync(path.join(pubDir, 'icon-192.png'), createPngBuffer(192, 192));
fs.writeFileSync(path.join(pubDir, 'icon-512.png'), createPngBuffer(512, 512));
console.log('PNG icons created successfully in public/ folder!');
