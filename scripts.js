document.getElementById('res-horizontal').value = window.screen.width.toString();
document.getElementById('res-vertical').value = window.screen.height.toString();

window.onload = function() {
    calcValues();
};

const originalBuildInFactors = {
    'default': 1.0,
    'shoulder-aim': 1.111111,
    'aim-down-sights': 1.851852,
    'deadeye': 3.703704,
    'marksman': 5.555556,
    'sniper': 3.703704,
    'aperture': 5.555556
}

const calculationValues = {
    'default': {
        'horizontal': 0,
        'vertical': 0,
        'zoom': 1.0,
        'buildInFactor': 1.0,
        'sensitivity': 0,
    },
    'shoulder-aim': {
        'horizontal': 0,
        'vertical': 0,
        'zoom': 1.0,
        'buildInFactor': 1.111111,
        'sensitivity': 0,
    },
    'aim-down-sights': {
        'horizontal': 0,
        'vertical': 0,
        'zoom': 2.04,
        'buildInFactor': 1.851852,
        'sensitivity': 0,
    },
    'deadeye': {
        'horizontal': 0,
        'vertical': 0,
        'zoom': 5.0,
        'buildInFactor': 3.703704,
        'sensitivity': 0,
    },
    'marksman': {
        'horizontal': 0,
        'vertical': 0,
        'zoom': 8.46,
        'buildInFactor': 5.555556,
        'sensitivity': 0,
    },
    'sniper': {
        'horizontal': 0,
        'vertical': 0,
        'zoom': 11.0,
        'buildInFactor': 3.703704,
        'sensitivity': 0,
    },
    'aperture': {
        'horizontal': 0,
        'vertical': 0,
        'zoom': 6.25,
        'buildInFactor': 5.555556,
        'sensitivity': 0,
    }
};

let aspectRatio = 0;

function changeZoomFactor() {
    const hipfire = document.getElementById('hipfire').value;
    hipfire == 'normal' ? calculationValues["shoulder-aim"].zoom = 1.0 : calculationValues["shoulder-aim"].zoom = 1.25;
}

function changeAspectRatio() {
    const resHorizontal = document.getElementById('res-horizontal').value;
    const resVertical = document.getElementById('res-vertical').value;
    aspectRatio = resHorizontal / resVertical;
}

function calcVerticalFovs() {
    let fov = document.getElementById('fov').value;
    for (const fovLevel in calculationValues) {
        calculationValues[fovLevel].vertical = Math.atan(Math.tan(Math.PI * fov / 360) / aspectRatio) / Math.PI * 360 / calculationValues[fovLevel].zoom;
    }
}

function calcHorizontalFovs() {
    let fov = document.getElementById('fov').value;
    for (const fovLevel in calculationValues) {
        calculationValues[fovLevel].horizontal = Math.atan(Math.tan(Math.PI * calculationValues[fovLevel].vertical / 360) * aspectRatio) / Math.PI * 360;
    }
}

function calcNewBuildInFactors() {
    const baseline = document.getElementById('baseline').value;
    for (const fovLevel in calculationValues) {
        calculationValues[fovLevel].buildInFactor = originalBuildInFactors[fovLevel] * (1 / originalBuildInFactors[baseline]);
    }
}

function calcSensitivity() {
    const sensitivity = document.getElementById('sensitivity').value.replace(',', '.');
    const mdCoefficient = document.getElementById('md-coefficient').value;
    const baseline = document.getElementById('baseline').value;
    for (const fovLevel in calculationValues) {
        if (mdCoefficient == 0) {
            calculationValues[fovLevel].sensitivity = sensitivity * calculationValues[fovLevel].buildInFactor * (Math.tan((calculationValues[fovLevel].horizontal * Math.PI) / 360)) / (Math.tan((calculationValues[baseline].horizontal * Math.PI) / 360));
        } else {
            calculationValues[fovLevel].sensitivity = sensitivity * calculationValues[fovLevel].buildInFactor * (Math.atan(mdCoefficient * Math.tan(calculationValues[fovLevel].horizontal * Math.PI / 360)) / (Math.atan(mdCoefficient * Math.tan(calculationValues[baseline].horizontal * Math.PI / 360))));
        }
    }
}

function showSensitivities() {
    const sensDefault = calculationValues['default'].sensitivity.toFixed(5);
    const sensShoulder = calculationValues['shoulder-aim'].sensitivity.toFixed(5);
    const sensAimDown = calculationValues['aim-down-sights'].sensitivity.toFixed(5);
    const sensDeadeye = calculationValues['deadeye'].sensitivity.toFixed(5);
    const sensMarksman = calculationValues['marksman'].sensitivity.toFixed(5);
    const sensSniper = calculationValues['sniper'].sensitivity.toFixed(5);
    const sensAperture = calculationValues['aperture'].sensitivity.toFixed(5);


    document.getElementById('sens-default').innerHTML = sensDefault
    document.getElementById('sens-shoulder').innerHTML = sensShoulder
    document.getElementById('sens-aimdown').innerHTML = sensAimDown
    document.getElementById('sens-deadeye').innerHTML = sensDeadeye
    document.getElementById('sens-marksman').innerHTML = sensMarksman
    document.getElementById('sens-sniper').innerHTML = sensSniper
    document.getElementById('sens-aperture').innerHTML = sensAperture

    document.getElementById('config-code').innerHTML = `
<Attr name="MouseSensitivity" value="${sensDefault}"/>
<Attr name="HipMouseSensitivity" value="${sensShoulder}"/>
<Attr name="IronSightsMouseSensitivity" value="${sensAimDown}"/>
<Attr name="ShortScopeMouseSensitivity" value="${sensDeadeye}"/>
<Attr name="MediumScopeMouseSensitivity" value="${sensMarksman}"/>
<Attr name="LongScopeMouseSensitivity" value="${sensSniper}"/>
<Attr name="PeepholeMouseSensitivity" value="${sensAperture}"/>`;
}

function validateFields() {
    const resHorizontal = document.getElementById('res-horizontal').value;
    const resVertical = document.getElementById('res-vertical').value;
    const fov = document.getElementById('fov').value;
    const sensitivity = document.getElementById('sensitivity').value.replace(',', '.');
    const mdCoefficient = document.getElementById('md-coefficient').value;
    if (fov == '' || fov > 110 || fov < 85 
        || sensitivity == '' || sensitivity < 0 
        || mdCoefficient == '' || mdCoefficient < 0 || mdCoefficient > 1 
        || resHorizontal == '' || resHorizontal < 0 || resVertical == '' || resVertical < 0) {
        return false;
    }
    return true;
}

function resizeTextarea() {
    const textarea = document.getElementById('config-code');
    textarea.style.height = textarea.scrollHeight + "px";
}

function calcValues() {
    if (!validateFields) { return; }
    changeZoomFactor();
    changeAspectRatio();
    calcVerticalFovs();
    calcHorizontalFovs();
    calcNewBuildInFactors();
    calcSensitivity();
    showSensitivities();
    resizeTextarea();
}

function copyToClipboard() {
    let clipboardInfo = document.getElementById('clipboard-info');
    let text = document.getElementById('config-code');
    navigator.clipboard.writeText(text.value);
    clipboardInfo.style.color = 'transparent';
    clipboardInfo.style.color = '#d7263d';
    let timer;
    clearTimeout(timer);
    timer = setTimeout(function(){
        clipboardInfo.style.color = 'transparent';
    }, 1000);
}

document.getElementById('config-code').addEventListener('click', function() {
    copyToClipboard();
})

document.getElementById('clipboard-icon').addEventListener('click', function() {
    copyToClipboard();
})

