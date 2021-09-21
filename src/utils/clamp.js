/* clamp.js
    
    Clamps a number to another number if within a certain tolerance.
*/

/* Clamps a number to another number if within a given tolerance.
    
    num - Number to clamp.
    ref - Reference number.
    tol - Tolerance number, within which num will be clamped to ref. Defaults to
        1.
    
    Returns the clamped value.
*/
export default (num, ref, tol) => {
    tol = (typeof tol === "number" && !isNaN(tol)) ? tol : 1;
    
    let diff = num - ref;
    
    diff = diff < 0 ? diff * -1 : diff;
    tol = tol < 0 ? tol * -1 : tol;
    
    return diff >= tol ? num : ref;
};
