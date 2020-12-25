import { buildSync } from 'esbuild';
// import { nanoid } from 'nanoid';
// import { readFileSync, writeFileSync, existsSync, unlinkSync } from 'fs';
// import { parse, join } from 'path';

const lowerCaseIgnoreds = [
  '*.jpeg',
  '*.jpg',
  '*.png',
  '*.gif',
  '*.webp',
  
  '*.css',
  '*.scss',
  '*.sass',
  '*.less',

  '*.pdf',
  '*.json',
  '*.gql',
];

const ignoreds = [...lowerCaseIgnoreds, ...toUpperCase(lowerCaseIgnoreds)];

function toUpperCase (arr: string[])
{
  return arr.map(e => e.toUpperCase());
}

// function createTempName (file: string)
// {
//   const id = nanoid();
//   const p = parse(file);
//   const dir = p.dir;
//   const dst = join(dir, p.name + '.' + id + '.wktmp' + p.ext);

//   return dst;
// }

// function createTempFile (src: string, dst: string)
// {
//   const srcCode = readFileSync(src).toString('utf8');
//   const dstCode = srcCode.replace(/import\s*('|")[^'"]+('|")/g, t => '// ' + t);

//   writeFileSync(dst, dstCode);
// }

export default function evaluate (file: string, externals?: string[])
{
  // const dst = createTempName(file);

  try
  {
    // createTempFile(file, dst);

    const result = buildSync({
      bundle: true,
      platform: 'node',
      external: [
        ...(externals ?? []),
        ...ignoreds,
      ],
      // entryPoints: [dst],
      entryPoints: [file],
      write: false,
    });
  
    const code = result?.outputFiles?.[0]?.text ?? '';

    // if (existsSync(dst))
    // {
    //   unlinkSync(dst);
    // }

    return code;
  }
  catch (err)
  {
    console.error(err);

    // if (existsSync(dst))
    // {
    //   unlinkSync(dst);
    // }
  }
}