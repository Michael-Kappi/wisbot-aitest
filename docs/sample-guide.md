# WisBot Enterprise Platform - Product Guide

## Overview

WisBot Enterprise Platform is a configuration and management tool for fleet logistics. It helps operators manage truck configurations, weight calculations, and compliance documentation across their entire fleet.

## Key Features

### 1. Truck Weight Calculator

The Truck Weight Calculator allows operators to compute total vehicle weight based on:

- **Chassis weight**: Base weight of the truck frame and cab
- **Axle configuration**: Number and type of axles (single, tandem, tridem)
- **Tyre selection**: Different tyre types affect weight and load capacity
- **Cargo load**: Weight of goods being transported
- **Fuel load**: Weight of fuel in tanks

To use the calculator:
1. Select your truck model from the dropdown
2. Choose the axle configuration
3. Select tyre types for each axle position
4. Enter cargo weight
5. Click "Calculate" to see total weight and per-axle distribution

### 2. Configuration Manager

The Configuration Manager lets you save and load truck configurations:

- **Save Configuration**: Store a complete truck setup for reuse
- **Load Configuration**: Recall a previously saved configuration
- **Compare Configurations**: View two configurations side-by-side
- **Export**: Download configuration as PDF or CSV

### 3. Preselection Module

The Preselection module helps you narrow down options before detailed configuration:

- Filter trucks by manufacturer, model year, and GVW rating
- View compatible trailer types
- Check regional compliance requirements
- See available optional equipment

### 4. Validation Engine

The Validation Engine checks your configuration against regulatory limits:

- **Weight limits**: Ensures total weight and per-axle weights comply with regulations
- **Dimension limits**: Checks overall length, width, and height
- **Regional rules**: Applies country-specific or state-specific regulations
- **Bridge formula**: Validates axle spacing and weight distribution

Validation results are shown as:
- Green checkmark: Within limits
- Yellow warning: Close to limits (within 5%)
- Red alert: Exceeds limits

## Tyre Selection

### Selecting Different Tyres for Truck and Trailer

You can select different tyre types for the truck and trailer independently:

1. In the Configuration screen, scroll to the **Tyres** section
2. The section is divided into **Truck Tyres** and **Trailer Tyres**
3. For each axle position, click the tyre dropdown to see available options
4. Select the desired tyre for each position
5. The weight calculator automatically updates when you change tyres

**Available tyre categories:**
- **Standard**: All-purpose tyres for general road use
- **Regional**: Optimized for shorter regional routes
- **Long Haul**: Designed for highway driving with low rolling resistance
- **Off-Road**: Heavy-duty tyres for construction and off-road use
- **Winter**: Cold weather and snow-rated tyres

### Tyre Impact on Weight

Different tyres have different weights. When selecting tyres, the system shows:
- Individual tyre weight
- Total weight change from tyre selection
- Impact on per-axle weight distribution

## Weights Module

The Weights module provides a comprehensive view of all weight-related data:

- **Kerb weight**: Vehicle weight without cargo or passengers
- **Gross Vehicle Weight (GVW)**: Maximum allowed total weight
- **Payload capacity**: GVW minus kerb weight
- **Axle load distribution**: Weight on each axle as percentage and absolute value
- **Remaining capacity**: How much more weight can be added

## Getting Started

1. Log in with your enterprise credentials
2. Select "New Configuration" or load an existing one
3. Follow the guided workflow: Preselection > Configuration > Validation > Weights
4. Save your configuration when complete

## Support

For technical support, contact your system administrator or use the built-in AI assistant (the bot icon in the top-right corner of the screen).
