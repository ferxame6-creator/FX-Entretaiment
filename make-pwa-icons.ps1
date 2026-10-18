Add-Type -AssemblyName System.Drawing

foreach ($size in @(192, 512)) {
  $bitmap = [System.Drawing.Bitmap]::new($size, $size)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.Clear([System.Drawing.Color]::FromArgb(23, 17, 19))
  $scale = $size / 512.0
  $scaled = { param($value) [single]($value * $scale) }

  $panel = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(33, 22, 25))
  $frame = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(129, 56, 70), (&$scaled 12))
  $grid = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(74, 52, 58), (&$scaled 8))
  $axis = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(227, 80, 104), (&$scaled 8))
  $dancerFill = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 82, 107))
  $dancerStroke = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(255, 240, 241), (&$scaled 10))
  $graphics.FillRectangle($panel, (&$scaled 42), (&$scaled 42), (&$scaled 428), (&$scaled 428))
  $graphics.DrawRectangle($frame, (&$scaled 42), (&$scaled 42), (&$scaled 428), (&$scaled 428))

  foreach ($coordinate in @(160, 256, 352)) {
    $graphics.DrawLine($grid, (&$scaled $coordinate), (&$scaled 100), (&$scaled $coordinate), (&$scaled 412))
    $graphics.DrawLine($grid, (&$scaled 100), (&$scaled $coordinate), (&$scaled 412), (&$scaled $coordinate))
  }
  $graphics.DrawLine($axis, (&$scaled 100), (&$scaled 256), (&$scaled 412), (&$scaled 256))
  $graphics.DrawLine($axis, (&$scaled 256), (&$scaled 100), (&$scaled 256), (&$scaled 412))

  foreach ($point in @(@(166,166), @(346,166), @(166,346), @(346,346))) {
    $x = &$scaled ($point[0] - 27)
    $y = &$scaled ($point[1] - 27)
    $diameter = &$scaled 54
    $graphics.FillEllipse($dancerFill, $x, $y, $diameter, $diameter)
    $graphics.DrawEllipse($dancerStroke, $x, $y, $diameter, $diameter)
  }
  $center = &$scaled (256 - 37)
  $diameter = &$scaled 74
  $graphics.FillEllipse($dancerFill, $center, $center, $diameter, $diameter)
  $graphics.DrawEllipse($dancerStroke, $center, $center, $diameter, $diameter)

  $bitmap.Save((Join-Path $PSScriptRoot "app-icon-$size.png"), [System.Drawing.Imaging.ImageFormat]::Png)
  $dancerStroke.Dispose(); $dancerFill.Dispose(); $axis.Dispose(); $grid.Dispose(); $frame.Dispose(); $panel.Dispose()
  $graphics.Dispose(); $bitmap.Dispose()
}
