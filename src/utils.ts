export const callbackQueryCreator = (route, data) => {
    const res = 'global:' + route + '|' + JSON.stringify(data)
    if (res.length > 60) {
        throw new Error('Too much data')
    }
    return res
}
