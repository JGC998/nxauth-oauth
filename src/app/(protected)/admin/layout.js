import React from 'react'

function layout({children}) {
    return (
        <main>
            <h1>Admin panel</h1>
            {children}
        </main>
    )
}

export default layout