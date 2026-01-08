import concurrently from 'concurrently'
concurrently([
    {
        name:'server',
        command:'bun run dev',
        cwd:'Packages/server',
        prefixColor:'cyan'
    },
    {
        name:'client',
        command:'bun run dev',
        cwd:'Packages/client',
        prefixColor:'green'
    }
])