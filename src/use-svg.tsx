
   
import React, { useMemo, useRef, useState } from 'react'
import SVG from 'react-inlinesvg'

type DefaultIconKeys = 'info' | 'user' | 'generic'
const defaultIcons: Record<DefaultIconKeys, React.ReactElement | null> = {
    info:  null,
    user: null,
    generic: null
}

const SVGWrapper = (props: any) => {
    const svg = useRef<any>(null)
    const [loaded, setLoaded] = useState(false)
    const [lastSvg, setLastSvg] = useState(props.src)
    
    return useMemo(() => {
        if (loaded) {
            if (lastSvg !== props.src) {
                setLoaded(false)
                setLastSvg(props.src)
                svg.current = <SVG {...props} onLoad={() => setLoaded(true)} />
            }
        }

        if (!loaded) {
            if (lastSvg === props.src) {
                svg.current =  <SVG {...props} onLoad={() => setLoaded(true)} />
            }
        }

        return svg.current
    }, [loaded, props.src])
}

export const useSVG = (svgName: string, className: string = 'w-4 h-4', color: string = 'currentColor') => {
    const defaultIcon: DefaultIconKeys = 'generic'
    return <SVGWrapper
        className={className}
        src={`/svg/${svgName}`}
        cacheRequests={true}
        loader={defaultIcons[defaultIcon] || null}
        preProcessor={(code: string) => code.replace(/fill=".*?"/g, `fill="${color}"`).replace(/width=".*?"/g, '').replace(/height=".*?"/g, '')}
    />
}

export const useSVGOriginal = (svgName: string, className: string = 'w-4 h-4') => {
    const defaultIcon: DefaultIconKeys = 'generic'
    return <SVGWrapper
        className={className}
        src={`/svg/${svgName}`}
        cacheRequests={true}
        loader={defaultIcons[defaultIcon] || null}
        preProcessor={(code: string) => code.replace(/width=".*?"/g, '').replace(/height=".*?"/g, '')}
    />
}