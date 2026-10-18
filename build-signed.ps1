$ErrorActionPreference = 'Stop'

$certificatePath = (Read-Host 'Ruta del certificado Authenticode (.pfx o .p12)').Trim('"')
if (-not (Test-Path -LiteralPath $certificatePath -PathType Leaf)) {
  throw 'No se encontró el archivo del certificado.'
}

$securePassword = Read-Host 'Contraseña del certificado' -AsSecureString
$passwordPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
try {
  $env:WIN_CSC_LINK = (Resolve-Path -LiteralPath $certificatePath).Path
  $env:WIN_CSC_KEY_PASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($passwordPointer)
  & npm.cmd run dist
  if ($LASTEXITCODE -ne 0) { throw "La compilación falló con código $LASTEXITCODE." }
}
finally {
  Remove-Item Env:WIN_CSC_LINK -ErrorAction SilentlyContinue
  Remove-Item Env:WIN_CSC_KEY_PASSWORD -ErrorAction SilentlyContinue
  [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($passwordPointer)
}
