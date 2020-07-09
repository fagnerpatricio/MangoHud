#version 450 core
layout(location = 0) out vec4 fColor;

layout(set=0, binding=0) uniform sampler2D sTexture;

layout(location = 0) in struct{
    vec4 Color;
    vec2 UV;
} In;

layout(push_constant) uniform uPushConstant{
    layout (offset = 16) int uMode;
} pc;

const float smoothing = 4.0/16.0; // depends on font scale and SDF "spread"
const float outlineWidth = 3.0/16.0;
const float outerEdgeCenter = 0.5 - outlineWidth;
const vec4 u_outlineColor = vec4(0, 0, 0, 1);

const float shadowSmoothing = 0.5; // Between 0 and 0.5
const vec4 shadowColor = vec4(0, 0, 0, 1);
const vec2 shadowOffset = vec2(2.0/1024.0, 2.0/512.0); // Between 0 and spread / textureSize

void main()
{
    float distance = texture(sTexture, In.UV.st).r;

    if (pc.uMode == 1) {
        float alpha = smoothstep(outerEdgeCenter - smoothing, outerEdgeCenter + smoothing, distance);
        float border = smoothstep(0.5 - smoothing, 0.5 + smoothing, distance);
        vec4 color = mix(u_outlineColor, In.Color, border);

        fColor = vec4(color.rgb, color.a * alpha);

    //     float shadowDistance = texture(sTexture, In.UV.st - shadowOffset).r;
    //     float shadowAlpha = smoothstep(0.5 - shadowSmoothing, 0.5 + shadowSmoothing, shadowDistance);
    //     vec4 shadow = vec4(shadowColor.rgb, shadowColor.a * shadowAlpha);
    //     fColor = mix(shadow, fColor, fColor.a);

    //fColor = vec4( mix(u_outlineColor, In.Color.rgb, border), alpha  * In.Color.a);
    } else {
        fColor = In.Color * vec4(1, 1, 1, distance);
    }
}
