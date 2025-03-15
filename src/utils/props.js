


export function extractPropsAndEvents(vDom){
    const {on:events,...props} = vDom.props;
    return {props,events}
}