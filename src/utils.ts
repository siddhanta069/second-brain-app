export function random(len: number) {
    const options = "hsadfhjhihuqryy8493y9yjkfdnaiinin34q4jj"
    let ans = ""

    for(let i=0; i< len; i++) {
        ans += options[Math.floor(Math.random() * options.length)]
    }
    return ans;
}