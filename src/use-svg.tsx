import React from 'react'
import SVG from 'react-inlinesvg'

export const useSVG = (svgName: string, className: string = 'w-4 h-4', color: string = 'currentColor') => {
    return <SVG
        className={className}
        src={`/svg/${svgName}`}
        cacheRequests={true}
        loader={<i className={className} />}
        preProcessor={code => code.replace(/fill=".*?"/g, `fill="${color}"`).replace(/width=".*?"/g, '').replace(/height=".*?"/g, '')}
    />
}

export const useSVGOriginal = (svgName: string, className: string = 'w-4 h-4') => {
    return <SVG
        className={className}
        src={`/svg/${svgName}`}
        cacheRequests={true}
        loader={<i className={className} />}
        preProcessor={code => code.replace(/width=".*?"/g, '').replace(/height=".*?"/g, '')}
    />
}
