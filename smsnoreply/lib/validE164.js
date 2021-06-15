/// Validate E164 format
export default function validE164(num) {
    return /^\+?[1-9]\d{1,14}$/.test(num)
}